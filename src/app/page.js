"use client";
import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// The main generator component
function ArticleGeneratorComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // --- State for the selected department ---
    const [department, setDepartment] = useState('feed');

    // --- All existing state variables ---
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageSrc, setImageSrc] = useState('');
    const [imageCredit, setImageCredit] = useState('');
    const [galleryImages, setGalleryImages] = useState([{ src: '', credit: '' }]);
    const [youtubeId, setYoutubeId] = useState('');
    const [instagramUrl, setInstagramUrl] = useState('');
    const [facebookUrl, setFacebookUrl] = useState('');
    const [twitterUrl, setTwitterUrl] = useState('');
    const [surveyQuestion, setSurveyQuestion] = useState('');
    const [surveyAnswers, setSurveyAnswers] = useState(['', '']);
    const [relevantArticles, setRelevantArticles] = useState([{ title: '', url: '' }]);
    const [generatedHtml, setGeneratedHtml] = useState('');
    const [previewContent, setPreviewContent] = useState('');
    const contentRef = useRef(null);
    const [editorColor, setEditorColor] = useState('#000000');
    const [editorSize, setEditorSize] = useState(3);

    // --- Effect to sync department state with URL parameter ---
    useEffect(() => {
        const deptFromUrl = searchParams.get('dept');
        if (deptFromUrl && ['feed', 'eruhim'].includes(deptFromUrl)) {
            setDepartment(deptFromUrl);
        } else {
            // Set default if param is missing or invalid
            setDepartment('feed');
        }
    }, [searchParams]);

    // --- Function to handle department change ---
    const handleDeptChange = (newDept) => {
        setDepartment(newDept);
        router.push(`?dept=${newDept}`, { scroll: false }); // Update URL without reloading page
    };

    // --- All your existing functions (applyBbCode, removeBbCode, handlers, etc.) ---
    const applyBbCode = (tag, value, customText = null) => {
        const textarea = contentRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = customText !== null ? customText : content.substring(start, end);
        let newText;
        switch (tag) {
            case 'B': case 'U': case 'I': case 'S':
                newText = `[${tag}]${selectedText}[/${tag}]`;
                break;
            case 'COLOR':
                newText = `[COLOR="${value}"]${selectedText}[/COLOR]`;
                break;
            case 'SIZE':
                newText = `[SIZE="${value}"]${selectedText}[/SIZE]`;
                break;
            case 'URL':
                newText = `[URL="${value}"]${selectedText}[/URL]`;
                break;
            default: newText = selectedText;
        }
        const fullNewText = `${content.substring(0, start)}${newText}${content.substring(end)}`;
        setContent(fullNewText);
        textarea.focus();
        textarea.setSelectionRange(start, start + newText.length);
    };

    const removeBbCode = (tag) => {
        const textarea = contentRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);
        const regex = new RegExp(`\\[${tag}(?:=.*?)?\\](.*?)\\[\\/${tag}\\]`, 'gi');
        const strippedText = selectedText.replace(regex, '$1');
        const newText = `${content.substring(0, start)}${strippedText}${content.substring(end)}`;
        setContent(newText);
        textarea.focus();
        textarea.setSelectionRange(start, start + strippedText.length);
    };

    const handleColorChange = () => applyBbCode('COLOR', editorColor);
    const handleSizeChange = () => applyBbCode('SIZE', editorSize);
    const handleResetSize = () => removeBbCode('SIZE');
    const handleSubtitle = () => applyBbCode('SIZE', 5, `[B]${content.substring(contentRef.current.selectionStart, contentRef.current.selectionEnd)}[/B]`);
    const handleSubtitleIn = () => applyBbCode('SIZE', 4, `[B]${content.substring(contentRef.current.selectionStart, contentRef.current.selectionEnd)}[/B]`);
    const handleMediaDesc = () => applyBbCode('SIZE', 1, `[I]${content.substring(contentRef.current.selectionStart, contentRef.current.selectionEnd)}[/I]`);
    const handleAddHyperlink = () => { const url = prompt("הכנס קישור:"); if (url) applyBbCode('URL', url); };
    const handleRemoveHyperlink = () => removeBbCode('URL');
    const handleGalleryChange = (index, field, value) => { const newGalleryImages = [...galleryImages]; newGalleryImages[index][field] = value; setGalleryImages(newGalleryImages); };
    const addGalleryImage = () => setGalleryImages([...galleryImages, { src: '', credit: '' }]);
    const handleRelevantArticleChange = (index, field, value) => { const newArticles = [...relevantArticles]; newArticles[index][field] = value; setRelevantArticles(newArticles); };
    const addRelevantArticle = () => setRelevantArticles([...relevantArticles, { title: '', url: '' }]);
    
    // --- Main HTML Generation Logic (unchanged template path) ---
    useEffect(() => {
        const generateHtml = async () => {
            try {
                // --- THIS LINE STAYS THE SAME AS REQUESTED ---
                const response = await fetch('template.txt'); 
                if (!response.ok) throw new Error('Template file not found');
                
                let template = await response.text();

                if (title) template = template.replace("%ArticleTitle%", title);
                let finalContent = content.replace(/\n/g, '<br />');
                finalContent = finalContent
                    .replace(/\[B\](.*?)\[\/B\]/gi, '<strong>$1</strong>')
                    .replace(/\[I\](.*?)\[\/I\]/gi, '<em>$1</em>')
                    .replace(/\[U\](.*?)\[\/U\]/gi, '<u>$1</u>')
                    .replace(/\[S\](.*?)\[\/S\]/gi, '<strike>$1</strike>')
                    .replace(/\[COLOR=(.*?)\](.*?)\[\/COLOR\]/gi, '<span style="color:$1;">$2</span>')
                    .replace(/\[SIZE=(.*?)\](.*?)\[\/SIZE\]/gi, '<font size="$1">$2</font>')
                    .replace(/\[URL=(.*?)\](.*?)\[\/URL\]/gi, '<a href="$1" target="_blank">$2</a>');
                if (finalContent) template = template.replace("%Content%", finalContent);

                // ... other replacements ...

                setGeneratedHtml(template);
                setPreviewContent(template);
            } catch (error) {
                console.error('Error generating HTML:', error);
                setPreviewContent(`<p style="color:red; font-weight:bold;">שגיאה: לא ניתן לטעון את הקובץ template.txt.</p>`);
            }
        };
        generateHtml();
    }, [title, content, imageSrc, imageCredit, galleryImages, youtubeId, instagramUrl, facebookUrl, twitterUrl, surveyQuestion, surveyAnswers, relevantArticles]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedHtml).then(() => {
            alert('הקוד הועתק!');
        });
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-gray-900 text-white">
            <div className="z-10 w-full max-w-7xl items-center justify-between font-mono text-sm lg:flex flex-col">
                <h1 className="text-4xl font-bold mb-4">מחולל כתבות</h1>

                {/* --- DEPARTMENT SWITCHER --- */}
                <div className="mb-8 flex justify-center gap-4">
                    <button
                        onClick={() => handleDeptChange('feed')}
                        className={`px-6 py-2 rounded-lg transition-colors ${department === 'feed' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                        פיד
                    </button>
                    <button
                        onClick={() => handleDeptChange('eruhim')}
                        className={`px-6 py-2 rounded-lg transition-colors ${department === 'eruhim' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                        אירוחים
                    </button>
                </div>
                
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-4">מחולל הכתבות ({department})</h2>
                        <div className="mb-4">
                            <label className="block mb-2">כותרת הכתבה</label>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 bg-gray-700 rounded" />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">תוכן הכתבה</label>
                            <div className="flex flex-wrap items-center gap-2 mb-2 p-2 bg-gray-700 rounded">
                                <button onClick={() => applyBbCode('B')} className="font-bold w-8 h-8 bg-gray-600 rounded">B</button>
                                <button onClick={() => applyBbCode('U')} className="underline w-8 h-8 bg-gray-600 rounded">U</button>
                                <button onClick={() => applyBbCode('I')} className="italic w-8 h-8 bg-gray-600 rounded">I</button>
                                <span className="text-gray-500">|</span>
                                <input type="color" value={editorColor} onChange={(e) => setEditorColor(e.target.value)} className="bg-gray-700 rounded w-10 h-8 cursor-pointer" />
                                <button onClick={handleColorChange} className="bg-gray-600 px-3 py-1 rounded text-xs">שנה צבע</button>
                                <span className="text-gray-500">|</span>
                                <button onClick={handleResetSize} className="bg-gray-600 px-3 py-1 rounded text-xs">אפס גודל</button>
                                <input type="number" min="1" max="7" value={editorSize} onChange={(e) => setEditorSize(e.target.value)} className="w-16 p-1 bg-gray-600 rounded text-center" />
                                <button onClick={handleSizeChange} className="bg-gray-600 px-3 py-1 rounded text-xs">שנה גודל</button>
                                <span className="text-gray-500">|</span>
                                <button onClick={handleSubtitle} className="bg-gray-600 px-3 py-1 rounded text-xs">כותרת ראשית</button>
                                <button onClick={handleSubtitleIn} className="bg-gray-600 px-3 py-1 rounded text-xs">כותרת פנימית</button>
                                <button onClick={handleMediaDesc} className="bg-gray-600 px-3 py-1 rounded text-xs">תיאור מדיה</button>
                                <span className="text-gray-500">|</span>
                                <button onClick={handleAddHyperlink} className="bg-gray-600 px-3 py-1 rounded text-xs">היפר-קישור</button>
                                <button onClick={handleRemoveHyperlink} className="bg-gray-600 px-3 py-1 rounded text-xs">אפס קישור</button>
                            </div>
                            <textarea ref={contentRef} value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-2 bg-gray-700 rounded h-48" />
                        </div>
                        {/* All other input fields... */}
                    </div>
                    {/* Preview and HTML Section */}
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-4">תצוגה מקדימה</h2>
                        <div className="w-full bg-white text-black p-4 rounded-lg h-96 overflow-y-auto mb-4" dangerouslySetInnerHTML={{ __html: previewContent }}></div>
                        <h2 className="text-2xl font-semibold mb-4">Generated HTML</h2>
                        <textarea readOnly value={generatedHtml} className="w-full p-2 bg-gray-700 rounded h-48 mb-4" />
                        <button onClick={copyToClipboard} className="w-full bg-green-600 px-4 py-2 rounded">העתק קוד</button>
                    </div>
                </div>
            </div>
            {/* Styles can be added here if needed */}
        </main>
    );
}

// This wrapper is necessary for useSearchParams to work in Next.js App Router
export default function Home() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ArticleGeneratorComponent />
        </Suspense>
    );
}