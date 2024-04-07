import { useState } from 'react';
import { Modal, Button } from 'antd';

export default function AddProduct() {

    const [visible, setVisible] = useState(false);

    return (
        <div>
            <Button type='primary' size='large' ghost onClick={() => {
                setVisible(true);
            }}>Add</Button>
            <Modal
                title="Add Product"
                open={visible}
                onOk={() => setVisible(false)}
                onCancel={() => setVisible(false)}
                okButtonProps={{
                    size: 'large',
                }}
                cancelButtonProps={{
                    size: 'large',
                }}
                width={1000}
            >
                
            </Modal>
        </div>
    );
}