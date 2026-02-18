import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function getNotificationData(notification) {
  if (!notification?.title || !notification?.action) {
    return null;
  }

  if (notification.action === 'created') {
    return {
      title: notification.title,
      actionText: 'foi criada',
    };
  }

  if (notification.action === 'edited') {
    return {
      title: notification.title,
      actionText: 'foi editada',
    };
  }

  return null;
}

export default function useExpenseNotification() {
  const location = useLocation();
  const navigate = useNavigate();
  const notification = location.state?.expenseNotification;

  const notificationData = useMemo(
    () => getNotificationData(notification),
    [notification],
  );

  const notificationKey = useMemo(
    () => `${location.key}-${notification?.action ?? ''}-${notification?.title ?? ''}`,
    [location.key, notification?.action, notification?.title],
  );

  useEffect(() => {
    if (!notificationData) {
      return;
    }

    const timeoutId = setTimeout(() => {
      navigate(location.pathname, { replace: true, state: null });
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [location.pathname, navigate, notificationData]);

  const clearNotification = () => {
    if (!notificationData) {
      return;
    }

    navigate(location.pathname, { replace: true, state: null });
  };

  return {
    notificationData,
    notificationKey,
    clearNotification,
  };
}
