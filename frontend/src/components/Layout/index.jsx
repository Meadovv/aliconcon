import Header from '../Header';
import Footer from '../Footer';
import { Fragment } from 'react';

import Guest from '../Middleware/Guest';
import Public from '../Middleware/Public';
import Private from '../Middleware/Private';

export default function Layout({ header, footer, children, middleware }) {
    const Container = () => {
        return (
            <>
                {header && <Header />}
                {children}
                {footer && <Footer />}
            </>
        );
    };

    if (middleware === 'guest') {
        return (
            <Fragment>
                <Guest>
                    <Container />
                </Guest>
            </Fragment>
        );
    }

    if (middleware === 'public') {
        return (
            <Fragment>
                <Public>
                    <Container />
                </Public>
            </Fragment>
        );
    }

    if (middleware === 'private') {
        return (
            <Fragment>
                <Private>
                    <Container />
                </Private>
            </Fragment>
        );
    }
}
