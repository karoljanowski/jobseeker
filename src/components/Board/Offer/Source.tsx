const Source = ({ source }: { source: string }) => {
    const isUrl = source.startsWith('http')
    const displaySource = isUrl ? new URL(source).hostname : source

    return (
        <div className='flex flex-col'>
            <span className='text-gray-400 text-sm'>Source</span>
            {isUrl ? (
                <a href={source} target='_blank' rel='noopener noreferrer'
                    className='text-blue-500 hover:text-blue-400 transition-colors'>{displaySource}</a>
            ) : (
                <span>{displaySource}</span>
            )}
        </div>
    )
}

export default Source;