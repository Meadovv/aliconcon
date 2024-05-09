import React from "react";
import { Input, Button, VStack } from "@chakra-ui/react";

export default function Tracking() {
    const [orderID, setOrderID] = React.useState("");

    const getTracking = async () => {
        alert("Tracking ID: " + orderID);
    }

    const handleInputChange = (event) => {
        setOrderID(event.target.value);
    }

    return (
        <VStack spacing={3} align="center" className="container my-5">
            <Input 
                type="text" 
                value={orderID} 
                onChange={handleInputChange} 
                placeholder="Enter Order ID" 
            />
            <Button colorScheme="orange" onClick={getTracking}>Track Your Order</Button>
        </VStack>
    );
}