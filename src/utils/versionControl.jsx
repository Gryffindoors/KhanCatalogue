import { APP_CONFIG } from "../config/appConfig";

const STORAGE_KEYS = {
  uiVersion: "catalogue_ui_version",
  dataVersion: "catalogue_data_version",
  reloadLock: "catalogue_reload_lock",
};

function clearAppStorage() {
  const savedLanguage = localStorage.getItem("catalogue_language");

  localStorage.clear();

  if (savedLanguage) {
    localStorage.setItem("catalogue_language", savedLanguage);
  }
}

function reloadOnce(reason) {
  const currentReloadLock = sessionStorage.getItem(STORAGE_KEYS.reloadLock);

  if (currentReloadLock === reason) {
    return;
  }

  sessionStorage.setItem(STORAGE_KEYS.reloadLock, reason);
  window.location.reload();
}

export function checkAppVersions(apiDataVersion) {
  const currentUiVersion = APP_CONFIG.UI_VERSION;
  const currentDataVersion =
    apiDataVersion !== null && apiDataVersion !== undefined
      ? String(apiDataVersion)
      : "";

  const savedUiVersion = localStorage.getItem(STORAGE_KEYS.uiVersion);
  const savedDataVersion = localStorage.getItem(STORAGE_KEYS.dataVersion);

  const isFirstRun = !savedUiVersion || !savedDataVersion;

  if (isFirstRun) {
    localStorage.setItem(STORAGE_KEYS.uiVersion, currentUiVersion);
    localStorage.setItem(STORAGE_KEYS.dataVersion, currentDataVersion);
    sessionStorage.removeItem(STORAGE_KEYS.reloadLock);
    return false;
  }

  const uiVersionChanged = savedUiVersion !== currentUiVersion;
  const dataVersionChanged = savedDataVersion !== currentDataVersion;

  if (uiVersionChanged || dataVersionChanged) {
    clearAppStorage();

    localStorage.setItem(STORAGE_KEYS.uiVersion, currentUiVersion);
    localStorage.setItem(STORAGE_KEYS.dataVersion, currentDataVersion);

    const reloadReason = `ui:${currentUiVersion}|data:${currentDataVersion}`;

    reloadOnce(reloadReason);

    return true;
  }

  sessionStorage.removeItem(STORAGE_KEYS.reloadLock);
  return false;
}