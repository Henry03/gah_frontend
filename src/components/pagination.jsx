function Pagination ({firstPage, prevPage, nextPage, lastPage, currentPage, setCurrentPage}) {
    return (
        <div className="grid justify-center mx-auto w-full m-5">
            <div className="join">
                {
                    currentPage != 1 ?
                        <button className="join-item btn" onClick={()=>setCurrentPage(firstPage)}>{firstPage}</button>
                    : ""
                }
                {
                    currentPage > 2 && prevPage > firstPage ?
                    <button className="join-item btn" onClick={()=>setCurrentPage(prevPage)}>{prevPage}</button>
                    : ""
                }
                    <button className="join-item btn btn-disabled">...</button>
                {
                    nextPage != lastPage && nextPage <lastPage ?
                    <button className="join-item btn" onClick={()=>setCurrentPage(nextPage)}>{nextPage}</button>
                    : ""
                }
                {
                    currentPage != lastPage ?
                        <button className="join-item btn" onClick={()=>setCurrentPage(lastPage)}>{lastPage}</button>
                    : ""
                }
            </div>

        </div>
    )
}

export default Pagination