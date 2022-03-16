/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import mParticle from '@mparticle/web-sdk';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Button } from '@mui/material';
import { NavigationMenu } from '../../components/NavigationMenu';
import { ShopPage } from '../../pages/ShopPage';
import { AboutPage } from '../../pages/AboutPage';
import './index.css';
import theme from '../../contexts/theme';
import { ProductDetailPage } from '../../pages/ProductDetailPage';
import { CartPage } from '../../pages/CartPage';
import { StartShoppingModal } from '../../components/StartShoppingModal';
import OrderDetailsProvider from '../../contexts/OrderDetails';
import UserDetailsProvider from '../../contexts/UserDetails';
import { AccountPage } from '../../pages/AccountPage';
import { MessageModal } from '../../components/MessageModal';
import { APIkeyModalMessage } from '../../constants';

const App = () => {
    const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);

    const mParticleConfig: mParticle.MPConfiguration = {
        isDevelopmentMode: true,
        // logLevel can be 'verbose', 'warning', or 'none' (the default is 'warning').
        // This logLevel provides context into the inner workings of mParticle.
        // It can be updated after MP has been initialized using mParticle.setLogLevel().
        // and passing.  Logs will be available in the inspector.
        // More can be found at https://docs.mparticle.com/developers/sdk/web/custom-logger/
        logLevel: 'verbose',

        // This callback will be called when mParticle successfully initializes
        // and will return any known User Identities from mParticle.
        // You can then synchronize this user data with any services that are
        // unique to your application.
        identityCallback: (result) => {
            if (result.getUser()) {
                // User has been identified
                // proceed with any custom logic that requires a valid, identified user

                const user = result.getUser();
                const identities = user.getUserIdentities();

                // We are simply logging the User Identities object as an example of the
                // contents
                console.log('User Identities', identities);
            } else {
                // the IDSync call failed
            }
        },
    };

    // this should be defined in .env the
    const apiKey = process.env.REACT_APP_MPARTICLE_API_KEY;

    useEffect(() => {
        if (apiKey) {
            mParticle.init(apiKey, mParticleConfig);
        } else {
            setApiKeyModalOpen(true);
            console.error('Please add your mParticle API Key');
        }
    }, []);

    return (
        <div className='App'>
            <ThemeProvider theme={theme}>
                <UserDetailsProvider>
                    <OrderDetailsProvider>
                        <BrowserRouter>
                            {/* Hide Shopping dialog if api key warning is visible */}
                            {!apiKeyModalOpen && <StartShoppingModal />}
                            <MessageModal
                                message={APIkeyModalMessage}
                                open={apiKeyModalOpen}
                                buttonAction={
                                    <>
                                        <Button
                                            variant='contained'
                                            target='_new'
                                            href='https://github.com/mParticle/mparticle-web-sample-apps/blob/main/core-sdk-samples/higgs-shop-sample-app/README.md'
                                        >
                                            Go to Readme
                                        </Button>
                                        <Button
                                            variant='contained'
                                            target='_new'
                                            href='https://docs.mparticle.com/developers/quickstart/senddata/#1-generate-your-api-key-2'
                                        >
                                            Go to Docs
                                        </Button>
                                    </>
                                }
                            />
                            <NavigationMenu />
                            <Routes>
                                <Route path='/' element={<ShopPage />} />
                                <Route path='shop' element={<ShopPage />} />
                                <Route path='about' element={<AboutPage />} />
                                <Route
                                    path='account'
                                    element={<AccountPage />}
                                />
                                <Route path='cart' element={<CartPage />} />
                                <Route
                                    path='/products/:id'
                                    element={<ProductDetailPage />}
                                />
                            </Routes>
                        </BrowserRouter>
                    </OrderDetailsProvider>
                </UserDetailsProvider>
            </ThemeProvider>
        </div>
    );
};

export default App;
