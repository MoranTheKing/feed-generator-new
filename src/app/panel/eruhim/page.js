"use client";

import PanelButton from "../hooks/PanelButton";
import PanelFrame from '../PanelFrame';
import usePanelCodeInfo from '../hooks/usePanelCodeInfo';

export default function EruhimPanel() {
  const info = usePanelCodeInfo();
  const role = info?.role || '';
  const actions = [
    <PanelButton key="example" className="text-xl text-center rounded-lg shadow-md font-bold bg-blue-700 hover:bg-blue-800 text-white">פעולה לדוגמה</PanelButton>,
    <PanelButton
      key="templates"
      href="/panel/eruhim/templates"
      className="text-xl text-center rounded-lg shadow-md font-bold bg-green-700 hover:bg-green-800 text-white"
    >ניהול תבניות ראיונות</PanelButton>
  ];
  return (
    <PanelFrame title="פאנל אחראי אירוחים" role={role} actions={actions} />
  );
}
