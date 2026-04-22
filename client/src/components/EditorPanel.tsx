/* eslint-disable @typescript-eslint/no-unused-vars */
import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
interface EditorPanelProps{
    selectedElement:{
        tagName:string;
        classname:string;
        text:string;
        image?: string; 
        styles:{
            padding:string;
            margin:string;
            backgroundColor:string;
            color:string;
            fontSize:string;
        };
    }|null;
    onUpdate:(updates:unknown)=> void;
    onClose:()=> void
}

const EditorPanel = ({selectedElement,onUpdate,onClose} :EditorPanelProps) => {
    const [values,setValues]=useState(selectedElement)
    const [uploading, setUploading] = useState(false);
    useEffect(()=>{
        setValues(selectedElement)
    },[selectedElement])
    if(!selectedElement||!values)
    {
        return null
    }
    const handleChange=(field:string,value:string)=>
    {
               const newValues={...values,[field]:value};
               if(field in values.styles)
               {
                      newValues.styles={...values.styles,[field]:value}
               }
               setValues(newValues )
               onUpdate({[field]:value})

    }
const handleStyelChange=(styleName:string,value:string)=>{
            const newStyles={...values.styles,[styleName]:value}
            setValues({...values,styles:newStyles})
            onUpdate({styles:{[styleName]:value}})
}
if(!selectedElement || !values) {
    return null
}

  return (
    <div className='absolute top-3 right-4 w-80 max-sm:w-[90%] max-sm:right-1 max-h-[80vh] overflow-y-auto bg-white rounded-lg shadow-xl border-gray-200 p-4 z-50 animate-fade-in fade-in'>
         <div className='flex justify-between items-center mb-4'>
            <h3>Edit Element</h3>
            <button onClick={onClose} className='p-1  hover:bg-gray-100 rounded-full'>
                
                <X className='w-4 h-4 text-gray-500'/>
            </button>
        </div>
        <div className='space-y-4 text-black'>
            <div>
                <label  className='block text-xs font-medium text-gray-500 mb-1' >TextContent</label>
                <textarea  value={values.text} onChange={(e)=>handleChange('text',e.target.value)} className='w-full text-sm p-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none min-h-20'/>
            </div>
            <div>
                <label  className='block text-xs font-medium text-gray-500 mb-1' >classname</label>
                <input  type='text' value={values.classname||''} onChange={(e)=>handleChange('classname',e.target.value)} className='w-full text-sm p-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none'/>
            </div>
            <div className='grid grid-cols-2 gap-3'>
                <div>
                      <label  className='block text-xs font-medium text-gray-500 mb-1' >Padding</label> 
                      <input  type='text' value={values.styles.padding} onChange={(e)=>handleStyelChange('padding',e.target.value)} className='w-full text-sm p-2 border rounded-md border-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none'/>
                </div>
                 <div>
                      <label  className='block text-xs font-medium text-gray-500 mb-1' >Margin</label> 
                      <input  type='text' value={values.styles.margin} onChange={(e)=>handleStyelChange('margin',e.target.value)} className='w-full text-sm p-2 border rounded-md border-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none'/>
                 </div>
            </div>
            <div className='grid grid-cols-2 gap-3'>
                   <div>
                      <label  className='block text-xs font-medium text-gray-500 mb-1' >FontSize</label> 
                      <input  type='text' value={values.styles.fontSize} onChange={(e)=>handleStyelChange('fontSize',e.target.value)} className='w-full text-sm p-2 border rounded-md border-gray-400 focus:ring-2 focus:ring-indigo-500 outline-none'/>
                 </div>
            </div>
             <div className='grid grid-cols-2 gap-3'>
                 <div>
                      <label  className='block text-xs font-medium text-gray-500 mb-1' >BackGround</label>
                      <div className='flex items-center gap-2 border border-gray-400 rounded-md p-1'>
                        <input  type='color' value={values.styles.backgroundColor==='rgba(0,0,0,0)'?'#ffffff':values.styles.backgroundColor} onChange={(e)=>handleStyelChange('backgroundColor',e.target.value)} className='w-6 h-6 cursor-pointer border-none p-8'/>
                        <span className='text-xs text-gray-600 truncate'>{values.styles.backgroundColor}</span>
                      </div> 
                      
                 </div>

             </div>
              <div>
                    <label className='block text-xs font-medium text-gray-500 mb-1'> Image
                    </label>

                  <input
                        type="file"
                        accept="image/*"
                        id="imageUpload"
                        className="hidden"
                        onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                          const formData = new FormData();
                           formData.append("image", file);

      try {
        setUploading(true);
const res = await fetch("http://localhost:3000/api/upload-image", {
  method: "POST",
  body: formData,
});

const data = await res.json();

setValues({ ...values, image: data.url || "" });
onUpdate({ image: data.url || "" });
// const data = await res.json();
// console.log(data);

// setValues({ ...values, image: data.imageUrl || "" });
// onUpdate({ image: data.imageUrl || "" });

      } catch (err) {
        console.log(err);
      } finally {
        setUploading(false);
      }
             }}
  />

  <button
    onClick={() => document.getElementById("imageUpload")?.click()}
    className="w-full p-2 text-sm border rounded-md hover:bg-gray-100"
  >
    {uploading ? "Uploading..." : "Upload Image"}
  </button>
              </div>
             <div className='grid grid-cols-2 gap-3'>
                 <div>
                      <label  className='block text-xs font-medium text-gray-500 mb-1' >Text Color</label>
                      <div className='flex items-center gap-2 border border-gray-400 rounded-md p-1'>
                        <input  type='color' value={values.styles.backgroundColor==='rgba(0,0,0,0)'?'#ffffff':values.styles.color} onChange={(e)=>handleStyelChange('color',e.target.value)} className='w-6 h-6 cursor-pointer border-none p-8'/>
                        <span className='text-xs text-gray-600 truncate'>{values.styles.color}</span>
                      </div> 
                      
                 </div>

             </div>
            
            
        </div>
    </div>
  )
}

export default EditorPanel



