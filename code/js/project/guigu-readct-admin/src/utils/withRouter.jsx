import {
    useLocation,
    useNavigate,
    useParams
} from "react-router-dom";
import React, {Component} from "react";

export default function withRouter(Component) {
    function ComponentWithRouterProp(props) {
/*        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();
        return (
            <Component
                {...props}
                router={{ location, navigate, params }}
            />
        );*/

            const location = useLocation();
            const navigate = useNavigate();
            return <Component {...props} location={location} navigate={navigate} />;

    }

    return ComponentWithRouterProp;
}
//export default withRouter()();
