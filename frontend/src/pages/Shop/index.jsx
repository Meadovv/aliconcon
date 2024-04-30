import { Fragment } from 'react';
import { Avatar, Button, Menu } from 'antd';
import { FaShopify, FaPlus, FaRocketchat, FaUserCheck, FaUserTag, FaShoppingBag, FaStarHalfAlt } from 'react-icons/fa';

import { 
    HeaderContainer,
    HeaderPanel,
    HeaderInformation,
    InformationCard,
    CategoryContainer, 
    BodyContainer
} from './style';

import Recommend from '../../components/Recommend';

export default function Shop() {
    return (
        <Fragment>
            <CategoryContainer>
                {`Aliconcon > Thế giới di động`}
            </CategoryContainer>
            <HeaderContainer>
                <HeaderPanel>
                    <div
                        style={{
                            display: 'flex',
                            gap: '1rem',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar size={64} icon={<FaShopify />} />
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    textTransform: 'capitalize',
                                }}
                            >
                                Thế giới di động
                            </div>
                            <div
                                style={{
                                    fontSize: '0.8rem',
                                    color: 'gray',
                                }}
                            >
                                Hoạt động 3 giờ trước
                            </div>
                        </div>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            gap: '1rem',
                        }}
                    >
                        <Button icon={<FaPlus />} block size="large">
                            Theo dõi
                        </Button>
                        <Button icon={<FaRocketchat />} block size="large">
                            Nhắn tin
                        </Button>
                    </div>
                </HeaderPanel>
                <HeaderInformation>
                    <InformationCard>
                        <FaShoppingBag />
                        Sản phẩm: 62,6k
                    </InformationCard>
                    <InformationCard>
                        <FaUserTag />
                        Người theo dõi: 546,7k
                    </InformationCard>
                    <InformationCard>
                        <FaStarHalfAlt />
                        Đánh giá: 4.8 (2,7 tr Đánh giá)
                    </InformationCard>
                    <InformationCard>
                        <FaUserCheck />
                        Tham gia: 4 Năm trước
                    </InformationCard>
                </HeaderInformation>
            </HeaderContainer>
            <BodyContainer>
                <Recommend title="Bán chạy" fetchUrl="/api/products/recommend" />
                <Recommend title="Đánh giá cao" fetchUrl="/api/products/recommend" />
                <Recommend title="Mới lên kệ" fetchUrl="/api/products/recommend" />
            </BodyContainer>
        </Fragment>
    );
}
