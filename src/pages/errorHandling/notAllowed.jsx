import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function NotAllowedPage(){
    const navigate = useNavigate()

    const goBack = () => {
        navigate(-3)
    }

    return(
        <section className="bg-white dark:bg-gray-900 ">
            <div className="container min-h-screen px-6 py-12 mx-auto lg:flex lg:items-center lg:gap-12">
                <div className="wf-ull lg:w-1/2">
                    <p className="text-sm font-medium text-blue-500 dark:text-blue-400">401 error</p>
                    <h1 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">Hi there</h1>
                    <p className="mt-4 text-gray-500 dark:text-gray-400">Its look like you're not supposed to be here.Here are some helpful links:</p>

                    <div className="flex items-center mt-6 gap-x-3">
                        <button className="flex items-center justify-center btn btn-outline">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 rtl:rotate-180">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                            </svg>


                            <Link onClick={()=>goBack()}>Go back</Link>
                        </button>

                        <Link className="btn btn-primary" to="/">
                            Take me home
                        </Link>
                    </div>
                </div>

                <div className="relative w-full mt-12 lg:w-1/2 lg:mt-0">
                    <img className="w-full max-w-lg lg:mx-auto" src="/images/components/illustration.svg" alt=""/>
                </div>
            </div>
        </section>
    )
}

export default NotAllowedPage;