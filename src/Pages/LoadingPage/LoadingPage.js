import './LoadingPage.scss';
import {useState, useEffect, useRef} from 'react';


const LoadingPage = (props) => {
    const [loading, setLoading] = useState(true);
    const isMounted = useRef(false);

    useEffect(()=>{
        if (isMounted.current) {
            setTimeout(()=>{
                setLoading(false);
            },1600);
            console.log('14');
        }
        else{
            if(props.loading)isMounted.current = true;
            console.log('18');
        }
    },[props.loading])
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
                <h1>Loading</h1>
            </div>}
        </>
    )
}

export default LoadingPage