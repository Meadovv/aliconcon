import React from 'react';
import { Tabs, Tab, TabList, TabPanels, TabPanel } from '@chakra-ui/react';

import ProductsTab from './_Products';
import GroupTab from './_Group';

export default function Products() {

    return (
        <Tabs>
            <TabList>
                <Tab>Products</Tab>
                <Tab>Groups</Tab>
            </TabList>

            <TabPanels>
                <TabPanel>
                    <ProductsTab />
                </TabPanel>
                <TabPanel>
                    <GroupTab />
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
}
