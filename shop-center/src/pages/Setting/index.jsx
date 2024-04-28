import { Button, Popconfirm } from 'antd'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Settings() {
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();

    return (
        <Layout>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                }}
            >
                <div>
                    <div
                        style={{
                            display: user.role < 2 ? 'flex' : 'none',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div>Account List</div>
                        <div>
                            <Button type="primary" size="large" ghost>
                                Add Account
                            </Button>
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        display: user.role < 2 ? 'flex' : 'none',
                        justifyContent: 'space-between',
                    }}
                >
                    <div>Danger Zone</div>
                    <Button type="primary" danger ghost size="large">
                        Delete Shop
                    </Button>
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}
                >
                    <Popconfirm
                        title="Logout"
                        description="Are you sure to logout?"
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{
                            type: 'primary',
                            danger: true,
                            size: 'large',
                        }}
                        cancelButtonProps={{
                            size: 'large',
                            type: 'primary',
                        }}
                        onConfirm={() => navigate('/logout')}
                    >
                        <Button type="primary" danger size="large">
                            Logout
                        </Button>
                    </Popconfirm>
                </div>
            </div>
        </Layout>
    );
}

export default Settings;