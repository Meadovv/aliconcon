import Header from '../Header';
import Footer from '../Footer';
import Content from '../Content';
import { Fragment } from 'react';

import Guest from '../Middleware/Guest';
import Public from '../Middleware/Public';
import Private from '../Middleware/Private';

import { Layout as OriginalLayout } from 'antd';

export default function Layout({ header, footer, page, middleware }) {
    const Container = () => {
        return (
            <OriginalLayout>
                {header && <Header />}
                <Content page={page} />
                {footer && <Footer />}
            </OriginalLayout>
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
