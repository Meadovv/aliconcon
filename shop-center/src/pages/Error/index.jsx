import Layout from "../../components/Layout"
import CONFIG from "../../configs"

export default function Error({ error = CONFIG.ERROR.PAGE_NOT_FOUND }) {
    return (
        <Layout>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 30
            }}>
                <img src={error} alt="error" style={{
                    width: '50%'
                }}/>
            </div>
        </Layout>
    )
}