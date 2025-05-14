import React from 'react';
import AnnouncementsCard from './AnnouncementsCard';
import RulesCard from './RulesCard';

const SidebarContent = ({ darkMode, announcements, rules }) => {
  return (
    <>
      <AnnouncementsCard darkMode={darkMode} announcements={announcements} />
      <RulesCard darkMode={darkMode} rules={rules} />
    </>
  );
};

export default SidebarContent;