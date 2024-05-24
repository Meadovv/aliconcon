import { useSelector } from "react-redux";

export default function Home() {

    const shop = useSelector((state) => state.auth.shop);

    return (
        <div>

            <div>This is your shop</div>
            <div>Shop name: {shop.name}</div>
            
        </div>
    );
}