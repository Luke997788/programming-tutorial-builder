import { Outlet, Link, useNavigate } from "react-router-dom"

function StudentLayout() {
    const navigate = useNavigate();
    
    function handleLogout() {
        sessionStorage.clear();
        navigate("/login");
    }

    return (
        <>
        <div id="nav-bar-container">
            <ul id="nav-bar">
                <li class="nav-bar-link"><Link to="/studenthome">Home</Link></li>
                <li class="nav-bar-link"><Link to="/studentmycourses">My Courses</Link></li>
                <li class="nav-bar-link"><Link to="/studentmyfeedback">My Feedback</Link></li>
                <div id="sessionInfoContainer">
                    <li><p id="userSignedIn">Signed in as: {sessionStorage.getItem("username")}</p></li>
                    <li><button id="logoutButton" onClick={handleLogout}>Logout</button></li>
                </div>
            </ul>
        </div>

        <Outlet />
        </>
    );
}

export default StudentLayout;