import { Box, Container, Typography, Link as MuiLink } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { ReactComponent as GoogleLogo } from '../assets/google.svg';
import { getGoogleUrl } from '../utils/getGoogleUrl';

const LoginPage = () => {
    const location = useLocation();
    let from = ((location.state )?.from?.pathname) || '/';

    return (
        <Container
            maxWidth={false}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',  
            }}
            className='backContainer'
        >
        
         
            <Box >
                <Typography
                    variant='h4'
                    component='p'
                    sx={{
                        my: '1.5rem',
                        textAlign: 'center',
                        color: 'black',
                    }}
                >
                    Welcome to the Automate Billing System
                </Typography>
             
                <Box
                    width='50%'
                    position='relative'
                    left='25%'
                    sx={{
                        backgroundColor: '#e5e7eb',
                        p: { xs: '1rem', sm: '10px' },
                        borderRadius: 2,
                    }}
                >
                    <Typography
                        variant='h6'
                        component='p'
                        sx={{
                            my: '1.5rem',
                            textAlign: 'center',
                            color: 'black',
                        }}
                    >
                        Log in with provider:
                    </Typography>
                    <MuiLink
                        href={getGoogleUrl(from)}
                        sx={{
                            backgroundColor: '#f5f6f7',
                            borderRadius: 1,
                            py: '0.6rem',
                            columnGap: '1rem',
                            textDecoration: 'none',
                            color: '#393e45',
                            cursor: 'pointer',
                            fontWeight: 500,
                            '&:hover': {
                                backgroundColor: '#fff',
                                boxShadow: '0 1px 13px 0 rgb(0 0 0 / 15%)',
                            },
                        }}
                        display='flex'
                        justifyContent='center'
                        alignItems='center'
                    >
                        <GoogleLogo style={{ height: '2rem' }} />
                        Login with Google
                    </MuiLink>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginPage;

