import NavBar from '../components/NavBar'

const AppLayout = ({children}) => {
    return (
        <div className='h-screen w-full flex flex-col'>
            <NavBar />
            <div className='flex-1'>
                {children}
            </div>
        </div>
    )
}

export default AppLayout
