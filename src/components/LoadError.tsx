type Props = {
    type: 'Page' | 'Modal';
}

const LoadError = ({type}: Props) => {
    if (type === 'Page') {
        return <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] text-slate-100 text-4xl animate-pulse">Error loading the page...  Try refreshing the browser or contact IT.</div>
    }

    if (type === 'Modal')
        return <div className="flex h-96 w-full flex-col items-center justify-center bg-gradient-to-b from-[#2f0f5b] to-[#6941a2] rounded-md text-slate-100 text-4xl px-4 animate-pulse">Error loading the page...  Try refreshing the browser or contact IT.</div>

    return null;
}

export default LoadError;