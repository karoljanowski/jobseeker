const Source = ({ source }: { source: string }) => {
    const displaySource = source.startsWith('http') 
        ? new URL(source).hostname
        : source

    return (
        <div className='flex flex-col'>
            <span className='text-neutral-500 text-sm'>Source</span>
            <a href={source} target='_blank' rel='noopener noreferrer'
                className='text-blue-500 hover:text-blue-400 transition-colors'>{displaySource}</a>
        </div>
    )
}

export default Source;