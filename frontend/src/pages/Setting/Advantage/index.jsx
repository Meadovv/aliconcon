import { Input, Button, VStack, Box } from '@chakra-ui/react';
import axios from 'axios';
import api from '../../../apis';
import React from 'react';
import { message } from 'antd';

export default function Advantage() {
    const [form, setForm] = React.useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = React.useState(false);

    const changePassword = async () => {
        if (form.oldPassword === '' || form.newPassword === '' || form.confirmPassword === '') {
            message.error('Please fill all fields');
            return;
        }
        if (form.newPassword !== form.confirmPassword) {
            message.error('New password and confirm password are not the same');
            return;
        }
        setLoading(true);
        await axios.post(api.CHANGE_PASSWORD, {
            oldPassword: form.oldPassword,
            newPassword: form.newPassword,
        }, {
            headers: {
                'x-client-id': localStorage.getItem('client'),
                'x-token-id': localStorage.getItem('token'),
            },
        }).then((res) => {
            message.success(res.data.message);
            setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        }).catch((err) => {
            console.log(err);
            message.error(err.response.data.message);
        })
        setLoading(false);
    };

    return (
        <VStack spacing={3} align="center">
            <Box w="60%">
                <VStack spacing={3}>
                    <Input
                        size="md"
                        type="password"
                        placeholder="Old Password"
                        onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
                        value={form.oldPassword}
                    />
                    <Input
                        size="md"
                        type="password"
                        placeholder="New Password"
                        onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                        value={form.newPassword}
                    />
                    <Input
                        size="md"
                        type="password"
                        placeholder="Confirm Password"
                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                        value={form.confirmPassword}
                    />
                </VStack>
            </Box>
            <Button colorScheme="orange" onClick={() => changePassword()} isLoading={loading}>
                Save
            </Button>
        </VStack>
    );
}
