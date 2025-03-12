
function SimpleButton() {

    const handleClick = () => {
        console.log("Hello world!");
    }
    return(
        <button onClick={handleClick}>

        </button>
    )
}

export default SimpleButton;