import { useState, useContext, useEffect, Suspense, lazy } from "react";
import Header from "../componentss/DashBoardComponents/Header";
import Sidebar from "../componentss/DashBoardComponents/SideBar";
import { sectionComponents } from "../ComponentDatas/ComponentDatas";
import Loading from "../componentss/AdditionalComponent/Loading";
import ErrorMessage from "../componentss/AdditionalComponent/ErrorMessage";
import { useAppState } from "@/states/hooks/useAppState";
// import { SidebarProvider, Sidebar } from '@/components/ui/sidebar'
const Dashboard = () => {
  const { sidebarOpen,     setSidebarOpen,     activeItem,     sidebarWidth,     isCollapsed ,isFullscreen  } = useAppState();

  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize and detect mobile breakpoint
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
    
    };

    // Initial check
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen, setSidebarOpen]);

  // Get the component dynamically
  const ActiveComponent = sectionComponents[activeItem];

  // Calculate main content margin based on sidebar state and screen size
  const getMainContentStyle = () => {
    if (isMobile) {
      // Mobile: no margin, full width
      return { 
        marginLeft: '0px',
        width: '100%'
      };
    }
    
    // Desktop: adjust margin based on sidebar width
    return { 
      marginLeft: `${sidebarWidth}px`,
      transition: 'margin-left 300ms ease-in-out',
      width: `calc(100% - ${sidebarWidth}px)`
    };
  };

  // Handle backdrop click to close sidebar on mobile
  const handleBackdropClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Sidebar */}
      <Sidebar/>
      {/* Mobile backdrop overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={handleBackdropClick}
          aria-label="Close sidebar"
        />
      )}

      {/* Main content area */}
      <div 
        className="flex-1 flex flex-col min-h-screen overflow-hidden"
        style={getMainContentStyle()}
      >
        {/* Header */}
          
        <Header />
    
        {/* Main content */}
        <main className="flex-1  bg-gray-50 px-2  ">
          <div className="h-full max-w-full">
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-[50vh] p-4">
                  <Loading 
                    variant="LoadingSpinner" 
                    fullScreen={false} 
                    size="lg" 
                  />
                </div>
              }
            >
              {ActiveComponent ? (
                <div className={`w-full ${isFullscreen?'mt-20':''}`}>
                  <ActiveComponent />
                </div>
              ) : (
                <div className="flex items-center justify-center min-h-[50vh] p-4 sm:p-6 md:p-10">
                  <div className="w-full max-w-md">
                    <ErrorMessage
                      message="Failed to load data"
                      description="We couldn't fetch the requested information. Please check your connection and try again."
                    />
                  </div>
                </div>
              )}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
