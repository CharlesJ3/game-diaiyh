import React from 'react';
import styled from 'styled-components';

interface NotificationItem {
  id: number;
  message: string;
  type: 'tutorial' | 'normal' | 'important' | 'logging';
  active: boolean;
  notificationStartTimer: number;
  notificationEndTimer: number;
}

interface NotificationsProps {
  notifications: NotificationItem[];
  removeNotification: (id: number) => void;
}

const NotificationsContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column-reverse;
  gap: 10px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
`;

const NotificationItem = styled.div.attrs<{ $progress: number }>(props => ({
  style: {
    '--progress': `${props.$progress}%`,
  },
})) <{ $type: string; $progress: number }>`
  background-color: ${props => {
    switch (props.$type) {
      case 'important': return '#ff9800';
      case 'tutorial': return '#2196f3';
      case 'logging': return '#4caf50';
      default: return '#f0f0f0';
    }
  }};
  color: ${props => props.$type === 'normal' ? '#333' : '#fff'};
  border-radius: 4px;
  padding: 10px 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  max-width: 300px;
  word-wrap: break-word;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: var(--progress);
    height: 4px;
    background-color: rgba(255, 255, 255, 0.5);
    transition: width 0.1s linear;
  }
`;

const Notifications: React.FC<NotificationsProps> = ({ notifications, removeNotification }) => {
  return (
    <NotificationsContainer>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          $type={notification.type}
          $progress={(notification.notificationStartTimer / notification.notificationEndTimer) * 100}
        >
          {notification.message}
        </NotificationItem>
      ))}
    </NotificationsContainer>
  );
};

export default Notifications;