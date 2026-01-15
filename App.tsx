import React, { useState } from 'react';
import { ViewState } from './types';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HomeFeed } from './components/HomeFeed';
import { CompanyProfile } from './components/CompanyProfile';
import { Associations } from './components/Associations';
import { CreatePost } from './components/CreatePost';
import { ChatNegotiation } from './components/ChatNegotiation';
import { NewsEventPromotion } from './components/NewsEventPromotion';
import { BusinessPartners } from './components/BusinessPartners';
import { NegotiationHub } from './components/NegotiationHub';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [createPostState, setCreatePostState] = useState<{show: boolean, type: 'thought' | 'promotion'}>({show: false, type: 'thought'});
  const [negotiationTab, setNegotiationTab] = useState<'feed' | 'negotiation' | 'closed' | 'my' | 'cancelled' | 'saved'>('feed');
  
  const [activeData, setActiveData] = useState<{
      roomId?: string;
      companyId?: string;
      chatUserId?: string;
  }>({});

  const handleOpenRoom = (roomId: string) => {
    setActiveData({ ...activeData, roomId });
    setCurrentView(ViewState.NEGOTIATION_ROOM);
  };

  const handleOpenProfile = (companyId: string) => {
    setActiveData({ ...activeData, companyId });
    setCurrentView(ViewState.PROFILE);
  };

  const handleOpenChat = (userId?: string) => {
    setActiveData({ ...activeData, chatUserId: userId });
    setCurrentView(ViewState.CHAT_DETAIL);
  };

  const handleBackToHub = () => {
     setActiveData({});
     setCurrentView(ViewState.NEGOTIATION_HUB);
  }

  const handleViewPartners = () => {
     setActiveData({});
     setCurrentView(ViewState.PARTNERS);
  }

  const handleGoToSaved = () => {
    setNegotiationTab('saved');
    setCurrentView(ViewState.NEGOTIATION_HUB);
  };

  const handleGoToCancelled = () => {
    setNegotiationTab('cancelled');
    setCurrentView(ViewState.NEGOTIATION_HUB);
  };

  const handleGoToClosed = () => {
    setNegotiationTab('closed');
    setCurrentView(ViewState.NEGOTIATION_HUB);
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.HOME:
        return (
          <HomeFeed 
            setCreatePost={(type) => setCreatePostState({show: true, type: type || 'thought'})} 
            onViewProfile={handleOpenProfile}
            onViewPartners={handleViewPartners}
            onGoToSaved={handleGoToSaved}
            onGoToCancelled={handleGoToCancelled}
            onGoToClosed={handleGoToClosed}
          />
        );
      case ViewState.PROFILE:
        return <CompanyProfile onBack={() => setCurrentView(ViewState.HOME)} onChat={() => handleOpenChat('c1')} onOpenNegotiationHistory={() => setCurrentView(ViewState.NEGOTIATION_HUB)} />;
      case ViewState.ASSOCIATIONS:
        return <Associations onViewProfile={handleOpenProfile} onChat={handleOpenChat} />;
      case ViewState.NEGOTIATION_HUB:
        return (
          <NegotiationHub 
            onOpenRoom={handleOpenRoom} 
            onViewProfile={handleOpenProfile}
            activeTab={negotiationTab} 
            setActiveTab={setNegotiationTab} 
            onCreatePromotion={() => setCreatePostState({show: true, type: 'promotion'})}
          />
        );
      case ViewState.PARTNERS:
        return <BusinessPartners onChat={handleOpenChat} onViewProfile={handleOpenProfile} />;
      case ViewState.CHAT_LIST:
        return <ChatNegotiation mode="chat" onBack={() => setCurrentView(ViewState.HOME)} />;
      case ViewState.CHAT_DETAIL:
        return <ChatNegotiation mode="chat" onBack={() => setCurrentView(ViewState.CHAT_LIST)} initialRoomId={activeData.chatUserId} />;
      case ViewState.NEGOTIATION_ROOM:
        return (
          <ChatNegotiation 
            mode="negotiation" 
            onBack={handleBackToHub} 
            initialRoomId={activeData.roomId} 
            onGoToCancelled={handleGoToCancelled}
            onGoToClosed={handleGoToClosed}
          />
        );
      case ViewState.NEWS_EVENTS:
        return <NewsEventPromotion onJoinNegotiation={() => handleOpenRoom('new_from_promo')} onCreatePost={() => setCreatePostState({show: true, type: 'promotion'})} />;
      case ViewState.NOTIFICATIONS:
        return <div className="pt-20 text-center text-gray-500">Danh sách thông báo (Demo)</div>;
      default:
        return <HomeFeed setCreatePost={(type) => setCreatePostState({show: true, type: type || 'thought'})} onGoToSaved={handleGoToSaved} />;
    }
  };

  const getTitle = (view: ViewState) => {
    switch (view) {
      case ViewState.PROFILE: return 'Hồ sơ Công ty';
      case ViewState.ASSOCIATIONS: return 'Hiệp hội';
      case ViewState.NEGOTIATION_HUB: return 'Thương thảo';
      case ViewState.CHAT_LIST: return 'Tin nhắn';
      case ViewState.CHAT_DETAIL: return 'Cuộc trò chuyện';
      case ViewState.PARTNERS: return 'Danh bạ';
      case ViewState.NEWS_EVENTS: return 'Sự kiện';
      case ViewState.HOME: return 'Trang chủ';
      case ViewState.NOTIFICATIONS: return 'Thông báo';
      default: return '';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 font-sans selection:bg-blue-200 selection:text-blue-900">
      <Header 
        currentView={currentView} 
        setView={setCurrentView} 
        title={currentView === ViewState.HOME || currentView === ViewState.PROFILE ? undefined : getTitle(currentView)} 
      />
      <main className="max-w-md mx-auto bg-white min-h-screen shadow-2xl overflow-hidden relative">
        {renderView()}
      </main>
      {currentView !== ViewState.NEGOTIATION_ROOM && currentView !== ViewState.CHAT_DETAIL && currentView !== ViewState.CHAT_LIST && (
        <Navigation currentView={currentView} setView={(view) => {
          if (view === ViewState.NEGOTIATION_HUB) setNegotiationTab('feed');
          setCurrentView(view);
        }} />
      )}
      {createPostState.show && (
        <CreatePost 
          onClose={() => setCreatePostState({ ...createPostState, show: false })} 
          type={createPostState.type}
        />
      )}
    </div>
  );
};

export default App;