import Header from "./Header";
import Footer from "./Footer";
import Middlewares from "../Middlewares";
import { Fragment } from "react";
import { Box } from "@chakra-ui/react";


export default function Layout({ component, middleware, layout }) {
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