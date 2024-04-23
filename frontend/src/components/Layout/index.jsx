import Header from "./Header";
import Footer from "./Footer";
import { Fragment } from "react";

export default function Layout({ component }) {
    return (
        <Fragment>
            <Header />
            {component}
            <Footer />
        </Fragment>
    )
}