import logo from './favicon.svg';

export const assets = {
    logo,
};

export const appPlans = [
        {
            id: 'basic',
            name: 'Basic',
            price: '$5',
            credits: 100,
            description: 'Start Now, scale up as you grow.',
            features: ['Upto 20 Creations', 'Limited Revisions', 'Basic AI Models', 'email support', 'Basic analytics',],
        },
        {
            id: 'pro',
            name: 'Pro',
            price: '$19',
            credits: 400,
            description: 'Add credits to create more projects',
            features: ['Upto 80 Creations', 'Extended Revisions', 'Advanced AI Models', 'priority email support', 'Advanced analytics',],
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: '$49',
            credits: 1000,
            description: 'Add credits to create more projects',
            features: ['Upto 200 Creations', 'Increased Revisions', 'Advanced AI Models', 'email + chat support', 'Advanced analytics',],
        }
    ]



// export const iframeScript = `

//         <style id="ai-preview-style">
//         .ai-selected-element {
//             outline: 2px solid #6366f1 !important;
//         }
//         </style>
//         <script id="ai-preview-script">
//         (function () {
//             // If this HTML is opened directly (not in an iframe), do nothing.
//             if (window === window.parent) {
//             return;
//             }

//             let selectedElement = null;

//             function clearSelected() {
//             if (selectedElement) {
//                 selectedElement.classList.remove('ai-selected-element');
//                 selectedElement.removeAttribute('data-ai-selected');
//                 selectedElement.style.outline = '';
//                 selectedElement = null;
//             }
//             }

//             document.addEventListener('click', function (e) {
//             e.preventDefault();
//             e.stopPropagation();

//             clearSelected();

//             const target = e.target;

//             // Don't select body or html
//             if (!target || target.tagName === 'BODY' || target.tagName === 'HTML') {
//                 window.parent.postMessage({ type: 'CLEAR_SELECTION' }, '*');
//                 return;
//             }

//             selectedElement = target;
//             selectedElement.classList.add('ai-selected-element');
//             selectedElement.setAttribute('data-ai-selected', 'true');

//             const computedStyle = window.getComputedStyle(selectedElement);

//             window.parent.postMessage({
//                 type: 'ELEMENT_SELECTED',
//                 payload: {
//                 tagName: selectedElement.tagName,
//                 className: selectedElement.className,
//                 text: selectedElement.innerText,
//                 styles: {
//                     padding: computedStyle.padding,
//                     margin: computedStyle.margin,
//                     backgroundColor: computedStyle.backgroundColor,
//                     color: computedStyle.color,
//                     fontSize: computedStyle.fontSize
//                 }
//                 }
//             }, '*');
//             });

//            window.addEventListener('message', function (event) {

//     if (event.data.type === 'UPDATE_ELEMENT' && selectedElement) {
//         const updates = event.data.payload;

//         // TEXT
//         if (updates.text !== undefined) {
//             selectedElement.innerText = updates.text;
//         }

//         // CLASSNAME
//         if (updates.classname !== undefined) {
//             selectedElement.className = updates.classname;
//         }

//         // STYLES
//         if (updates.styles) {
//             Object.assign(selectedElement.style, updates.styles);
//         }

//         // 🚨 IMAGE SUPPORT (MAIN FIX)
//         if (updates.image !== undefined) {

//             // CASE 1: element is IMG
//             if (selectedElement.tagName === "IMG") {
//                 selectedElement.src = updates.image;
//             }

//             // CASE 2: not IMG → create img inside element
//             else {
//                 let img = selectedElement.querySelector("img");

//                 if (!img) {
//                     img = document.createElement("img");

//                     // optional styling
//                     img.style.maxWidth = "100%";
//                     img.style.height = "auto";

//                     selectedElement.appendChild(img);
//                 }

//                 img.src = updates.image;
//             }
//         }
//     }

//     else if (event.data.type === 'CLEAR_SELECTION_REQUEST') {
//         clearSelected();

//         document.querySelectorAll('.ai-selected-element,[data-ai-selected]').forEach(function (el) {
//             el.classList.remove('ai-selected-element');
//             el.removeAttribute('data-ai-selected');
//             el.style.outline = '';
//         });
//     }
// });
//         })();
//         </script>
// `;


export const iframeScript = `

<style id="ai-preview-style">
.ai-selected-element {
    outline: 2px solid #6366f1 !important;
}
</style>

<script id="ai-preview-script">
(function () {

    if (window === window.parent) return;

    let selectedElement = null;

    function init() {

        function clearSelected() {
            if (selectedElement) {
                selectedElement.classList.remove('ai-selected-element');
                selectedElement.removeAttribute('data-ai-selected');
                selectedElement.style.outline = '';
                selectedElement = null;
            }
        }

        document.addEventListener('click', function (e) {

            e.preventDefault();
            e.stopPropagation();

            const target = e.target;

            if (!target || target.tagName === 'BODY' || target.tagName === 'HTML') {
                window.parent.postMessage({ type: 'CLEAR_SELECTION' }, '*');
                return;
            }

            clearSelected();

            selectedElement = target;
            selectedElement.classList.add('ai-selected-element');
            selectedElement.setAttribute('data-ai-selected', 'true');

            const computedStyle = window.getComputedStyle(selectedElement);

            window.parent.postMessage({
                type: 'ELEMENT_SELECTED',
                payload: {
                    tagName: selectedElement.tagName,
                    className: selectedElement.className,
                    text: selectedElement.innerText,
                    styles: {
                        padding: computedStyle.padding,
                        margin: computedStyle.margin,
                        backgroundColor: computedStyle.backgroundColor,
                        color: computedStyle.color,
                        fontSize: computedStyle.fontSize
                    }
                }
            }, '*');
        });

        window.addEventListener('message', function (event) {

            if (event.data.type === 'UPDATE_ELEMENT') {

                const updates = event.data.payload;
                if (!selectedElement) return;

                if (updates.text !== undefined) {
                    selectedElement.innerText = updates.text;
                }

                if (updates.classname !== undefined) {
                    selectedElement.className = updates.classname;
                }

                if (updates.styles) {
                    Object.assign(selectedElement.style, updates.styles);
                }

                // =========================
                // ✅ FIXED IMAGE LOGIC ONLY
                // =========================
                if (updates.image !== undefined) {

                    if (selectedElement.tagName === "IMG") {
                        selectedElement.setAttribute("src", updates.image);
                    } else {

                        let img = selectedElement.querySelector("img");

                        if (!img) {
                            img = document.createElement("img");
                            img.style.maxWidth = "100%";
                            img.style.height = "auto";
                            img.style.display = "block";
                            selectedElement.appendChild(img);
                        }

                        img.setAttribute("src", updates.image);
                    }

                    // 🔥 IMPORTANT FIX: reset selection after image update
                    window.parent.postMessage({ type: 'CLEAR_SELECTION' }, '*');
                    selectedElement = null;
                }
            }

            else if (event.data.type === 'CLEAR_SELECTION_REQUEST') {

                selectedElement = null;

                document.querySelectorAll('.ai-selected-element,[data-ai-selected]')
                    .forEach(function (el) {
                        el.classList.remove('ai-selected-element');
                        el.removeAttribute('data-ai-selected');
                        el.style.outline = '';
                    });
            }
        });
    }

    window.onload = init;

})();
</script>
`;