import React from 'react'
import {
    Spinner as ChakraSpinner
} from '@chakra-ui/react'

function Spinner() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '90vh',
            width: '100%'
        }}>
            <ChakraSpinner size='xl' />
        </div>
    )
}

export default Spinner