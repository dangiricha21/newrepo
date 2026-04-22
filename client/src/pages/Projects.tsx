/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { Project } from '../types'
import Sidebar from '../components/Sidebar'
import { ArrowBigDownDashIcon, CloudHail, EyeIcon, EyeOffIcon, FullscreenIcon, LaptopIcon, Loader2Icon, MessageSquareIcon, RocketIcon, SaveIcon, SmartphoneIcon, TabletIcon, XIcon } from 'lucide-react'
//import { dummyConversations, dummyProjects, dummyVersion } from '../assets/assets'
import ProjectPreview, { type ProjectPreviewRef } from '../components/ProjectPreview'
import api from '@/configs/axios'
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'

function Projects() {

  const {projectId}=useParams()
  const navigate=useNavigate()
  const {data:session,isPending}=authClient.useSession()
  const [project ,setProject]=useState<Project|null>(null)
  const [isloading, setisLoading] = useState(false);
  const [liveUrl, setLiveUrl] = useState("");
  const [loading,setLoading]=useState(true)
  const[isGenerating,setIsGenerating]=useState(true)
  const[device,setDevice]=useState<'phone' |'tablet' |'desktop'>("desktop")
  const[isMenuOpen,setIsMenuOpen]=useState(false)
  const[isSaving,setIsSaving]=useState(false)
  const previewRef=useRef<ProjectPreviewRef>(null)
  const fetchProject=async()=>{
      

      try{
        const {data}=await api.get(`/api/user/project/${projectId}`);
        setProject(data.project)
        setIsGenerating(data.project.current_code?false:true)
        setLoading(false)
      }catch(error:any){
        toast.error(error?.response?.data?.message||error.message);
      }
  }
  const saveProject=async ()=>{
    if(!previewRef.current)return;
    const code=previewRef.current.getCode();
    if(!code)return;
    setIsSaving(true);
    try {
      const {data}=await api.put(`/api/project/save/${projectId}`,{code});
      toast.success(data.message)
    } catch (error:any) {
      toast.error(error?.response?.data?.message||error.message);
      console.log(error);
    }
    finally{
      setIsSaving(false);
    }
  };

  

const downloadCode = async () => {
  const code =
    previewRef.current?.getCode() || project?.current_code;

  if (!code || isGenerating) return;

  const zip = new JSZip();

 
  const cssMatches = [...code.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
  const css = cssMatches.map(m => m[1]).join("\n");

  
  const jsMatches = [...code.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi)];
  const js = jsMatches.map(m => m[1]).join("\n");

  
  let cleanHtml = code
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script(?![^>]*src)[^>]*>[\s\S]*?<\/script>/gi, "");

  
  cleanHtml = cleanHtml.replace(
    "</head>",
    `<link rel="stylesheet" href="style.css"></head>`
  );

  cleanHtml = cleanHtml.replace(
    "</body>",
    `<script src="script.js" defer></script></body>`
  );

  
  zip.file("index.html", cleanHtml);
  zip.file("style.css", css || "/* No CSS */");
  zip.file("script.js", js || "// No JS");

  
  zip.folder("assets");

  
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, "my-website.zip");
};
  const togglePublish= async ()=>{
    try {
      const {data}=await api.get(`/api/user/publish-toggle/${projectId}`);
      toast.success(data.message)
      setProject((prev)=>prev?({...prev,isPublished:!prev.isPublished}):null)
    } catch (error:any) {
      toast.error(error?.response?.data?.message||error.message);
      console.log(error);
    }
  }
  const extractCSS = (code:any) => {
  const matches = [...code.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
  return matches.map(m => m[1]).join("\n");
};

const extractJS = (code:any) => {
  if (typeof code !== "string") return "";

  const matches = code.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gi);

  if (!matches) return "";

  return matches
    .map(script =>
      script.replace(/<script\b[^>]*>/i, "").replace(/<\/script>/i, "")
    )
    .join("\n");
};
const handleDeploy = async () => {
  try {
    setisLoading(true);
   

    const code = previewRef.current?.getCode() || project?.current_code;
    if (!code) return;
   
    const css = extractCSS(code);
    const js = extractJS(code);
   
    const res = await api.post('/api/deploy', {
      html: code,
      css,
      js,
    });
  
    const data = res.data;
     console.log(data.url)

    if (!data?.url) return;

    setLiveUrl(data.url);
    localStorage.setItem("liveUrl", liveUrl);
    window.open(data.url, "_blank");

  } catch (err) {
    console.error(err);
  } finally {
    setisLoading(false);
  }
};

  useEffect(()=>{
    if(session?.user){
      fetchProject();
    }
    else if(!isPending&&!session?.user){
      navigate("/")
      toast("please login to view your projects")
    }
  },[session?.user])

  useEffect(()=>{
    if(project&&!project.current_code){
      const intervalId=setInterval(fetchProject,10000);
      return ()=>clearInterval(intervalId)
    }
    //fetchProject()
  },[project])
  useEffect(() => {
  const url = localStorage.getItem("liveUrl");
  if (url) setLiveUrl(url);
}, []);

  if(loading)
  {
        return(
        <> 
        <div className='flex items-center justify-center h-screen'>
          <Loader2Icon  className='size-7 animate-spin text-violet-200'/>
        </div>
        </>
        )
  }
  return project ?(
    <div className='flex flex-col h-screen w-full bg-gray-900 text-white'>
      {/* navbar */}
       <div className='flex max-sm:flex-col sm:items-center gap-4 px-4 py-2 no-scrollbar'>
         {/* left */}
         <div className='flex items-center gap-2 sm:min-w-90:text-nonwrap'>
          <img src="/favicon.svg" alt="logo"  className='h-6 cursor-pointer' onClick={()=>navigate('/')}/>
          <div className='max-w-64 sm:max-w-xs'>
            <p className='text-sm text-medium capitalize truncate'>{project.name}</p>
            <p className='text-xs text-gray-400 mt-0.5'>Previewing last saved version</p>
          </div>
          <div className=' flex-1 flex justify-end'>
             {
              isMenuOpen? <MessageSquareIcon onClick={()=>setIsMenuOpen(false)} className='size-6 cursor-pointer'/>:<XIcon  onClick={()=>setIsMenuOpen(true)} className='size-6 cursor-pointer'/>
             }
          </div>
         </div>
         {/* middle */}
         <div className='hidden sm:flex gap-2 bg-gray-950 p-1.5 rounded-md'>
          <SmartphoneIcon onClick={()=>setDevice('phone')} className={`size-6 p-1 rounded cursor-pointer ${device==='phone'?"bg-gray-700":""}`}/>
          <TabletIcon onClick={()=>setDevice('tablet')} className={`size-6 p-1 rounded cursor-pointer ${device==='tablet'?"bg-gray-700":""}`}/>
          <LaptopIcon onClick={()=>setDevice('desktop')} className={`size-6 p-1 rounded cursor-pointer ${device==='desktop'?"bg-gray-700":""}`}/>
         </div>
         {/* right */}
          <div className='flex items-center justify-end gap-4 flex-1 text-xs'>

                   <button onClick={saveProject}  disabled={isSaving} className='bg-gray-800 hover:bg-gray-700 text-white px-3.5 py-1 flex items-center gap-2 rounded sm:rounded-sm transition-colors border border-gray-700'>
                     {isSaving ? <Loader2Icon className='animate-spin' size={16}/>:<SaveIcon  className='hidden sm:block' size={16}/> }  Save
                   </button>

                   <Link target='_blank' to={`/preview/${projectId}`} className='flex items-center gap-2 px-4 py-1 rounded sm:rounded-sm border border-gray-700 hover:border-gray-500 transition-colors'><FullscreenIcon size={16} className='flex items-center gap-2 px-4 py-1 rounded sm:rounded-sm border border-gray-700 hover:border-gray-500 transition-colors'/>Preview</Link>

                   <button onClick={downloadCode} className='bg-linear-to-br from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white px-3.5 py-1
                    flex items-center gap-2 rounded sm:rounded-sm transition-colors'><ArrowBigDownDashIcon   className='hidden sm:block' size={16}/>Download</button>

            
    <button  onClick={handleDeploy}  disabled={isloading} className='bg-linear-to-br from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-3.5 py-1 flex items-center gap-2 rounded sm:rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
>
  {isloading ? (
    <>
      <Loader2Icon className='animate-spin' size={16} />
      Deploying...
    </>
  ) : (
    <>
      <RocketIcon   className='hidden sm:block' size={16} />
      Deploy
    </>
  )}
</button>
    {liveUrl && (
  <div className="flex items-center gap-3 bg-gray-900 border border-gray-700 px-3 py-2 rounded mt-2">
    
    <a href={liveUrl} target="_blank" rel="noreferrer" className="text-green-400 hover:underline text-xs truncate">
      {liveUrl}
    </a>

    <button onClick={() => { navigator.clipboard.writeText(liveUrl); alert("Link copied!"); }} className="bg-gray-800 hover:bg-gray-700 text-white px-2 py-1 rounded text-xs">
      Copy
    </button>

  </div>
)}
                 
  <div>
  </div>


         </div> 
        
       </div>
       <div className='flex-1 flex overflow-hidden'>
               <Sidebar isMenuOpen={isMenuOpen} project={project} setProject={(p)=>{setProject(p)}} isGenerating={isGenerating} setIsGenerating={setIsGenerating} />

                 <div className='flex-1 min-w-0  p-2 pl-0'><ProjectPreview ref={previewRef}  project={project} isGenerating={isGenerating} device={device}/></div>
       </div>
    </div>
  )
  :
  (
    <div className='flex items-center  justify-center h-screen'>
      <p className='text-2xl font-medium text-gray-200'>Unable to load projects</p>
    </div>
  )
}

export default Projects


