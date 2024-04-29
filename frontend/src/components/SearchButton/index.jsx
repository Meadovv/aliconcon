import { Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

export default function SearchButton({ placeholder, onSearch, size, buttonText, buttonColor, buttonTextColor }) {
    const customButton = (
        <Button type="primary" icon={<SearchOutlined />} style={{
            backgroundColor: buttonColor || 'var(--primary-color)',
            borderColor: buttonColor || 'var(--primary-color)',
            color: buttonTextColor || '#fff'
        }}>
            {buttonText || 'Tìm kiếm'}
        </Button>
    );

    const _onSearch = (value) => {
        if(!value) {
            alert('Không được để trống!');
        } else {
            if(onSearch) onSearch(value);
            else console.log(value);
        }
    };

    return (
        <Input.Search
            placeholder={placeholder || 'input search text'}
            allowClear
            enterButton={customButton}
            size={size || 'medium'}
            onSearch={_onSearch}
        />
    );
}
