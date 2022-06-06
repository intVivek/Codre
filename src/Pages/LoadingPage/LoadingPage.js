import './LoadingPage.scss';
import {useState, useEffect} from 'react';

const LoadingPage = (props) => {
    const [loading, setLoading] = useState(true);
    const [skipCount, setSkipCount] = useState(true);

    useEffect(()=>{
        if (skipCount) setSkipCount(false);
        if(!skipCount) setTimeout(()=>{
            setLoading(false);
        },1600);
    // eslint-disable-next-line
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
                <h1>Redirecting</h1>
            </div>}
        </>
    )
}

export default LoadingPage