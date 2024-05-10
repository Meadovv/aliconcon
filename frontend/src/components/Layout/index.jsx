import Header from "./Header";
import Footer from "./Footer";
import Middlewares from "../Middlewares";
import React, { Fragment } from "react";
import { Box } from "@chakra-ui/react";


export default function Layout({ component, middleware, layout }) {

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [component]);

    return (
        <Fragment>
            <Middlewares middleware={middleware} />
            {layout && <Header />}
            <Box minHeight='100vh'>
                <Middlewares middleware={middleware} component={component} />
            </Box>
            {layout && <Footer />}
        </Fragment>
    )
}