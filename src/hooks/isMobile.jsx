import { useEffect, useState } from "react";

export function useIsMobile(breakpoint = 768){
    const [isMobile, setIsMobile] = useState(false)

    useEffect(_=>{
        const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`)

        const handleChange = e =>{
            setIsMobile(e.matches)
        }

        setIsMobile(mediaQuery.matches)

        mediaQuery.addEventListener('change', handleChange)

        return(_=>{
            mediaQuery.removeEventListener('change', handleChange)
        })

    }, [breakpoint])

    return isMobile
}