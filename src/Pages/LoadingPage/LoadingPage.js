import './LoadingPage.scss';
import {useState, useEffect, useRef} from 'react';


const LoadingPage = (props) => {
    const [loading, setLoading] = useState(true);
    const [text, setText] = useState('Loading')
    const isMounted = useRef(false);
    const timeoutRef = useRef(false);

    useEffect(()=>{
        if (isMounted.current) {
            setTimeout(()=>{
                setLoading(false);
            },1600);
        }
        else{
            if(props.loading)isMounted.current = true;
        }
    },[props.loading])

    useEffect(()=>{
        timeoutRef.current = setTimeout(()=>setText('"Server is awakening from slumber; kindly exercise patience.(ETA: 2min)'), 10000);

        return ()=>clearTimeout(timeoutRef.current)

    }, [])

    return (
        <>
            { loading && <div className={props.loading?"loadingPageMain":"loadingPageMain mainLoaded"}>
                <div className={props.loading?"loadingPage":"loadingPage loadingLoaded"}>
                    <div className="loadingBody">
                        <span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </span>
                        <div className="base">
                            <span></span>
                            <div className="face"></div>
                        </div>
                    </div>
                    <div className={props.loading?"longfazers":"longfazers fazersLoaded"}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                <h1>{text}</h1>
            </div>}
        </>
    )
}

export default LoadingPage