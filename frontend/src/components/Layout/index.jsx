import Header from "./Header";
import Footer from "./Footer";
import Middlewares from "../Middlewares";
import { Fragment } from "react";

export default function Layout({ component, middleware, layout }) {
    return (
        <Fragment>
            <Middlewares middleware={middleware} />
            {layout && <Header />}
            {component}
            {layout && <Footer />}
        </Fragment>
    )
}