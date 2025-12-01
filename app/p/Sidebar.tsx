import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setCurrentEdit } from '@/slices/editModeSlice';
import HeroSidebar from '@/components/sidebar-forms/HeroSidebar';
import ProjectSidebar from '@/components/sidebar-forms/ProjectSidebar';
import ExperienceSidebar from '@/components/sidebar-forms/ExperienceSidebar';
import TechnologiesSidebar from '@/components/sidebar-forms/TechnologiesSidebar';
import ContactSidebar from '@/components/sidebar-forms/ContactSidebar';
import EducationSidebar from '@/components/sidebar-forms/EducationSidebar';
import TerminalSidebar from '@/components/sidebar-forms/TerminalSidebar';
import SimpleWhiteHeroSidebar from '@/components/sidebar-forms/SimpleWhiteHeroSidebar';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ColorTheme } from '@/lib/colorThemes';

const Sidebar = () => {
  const { currentlyEditing } = useSelector((state: RootState) => state.editMode);
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentlyEditing) {
      setIsExpanded(true);
    } else {
      setIsExpanded(false);
    }
  }, [currentlyEditing]);

  if (!currentlyEditing) return null;

  return (
    <div className={`fixed left-0 top-0 h-screen z-[99999] transition-all duration-300 ease-in-out ${isExpanded ? 'w-80' : 'w-0'} border-r border-gray-700 overflow-hidden`}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4 z-50"
        onClick={() => dispatch(setCurrentEdit(""))}
        style={{
          color: ColorTheme.textSecondary,
          backgroundColor: 'transparent'
        }}
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="flex flex-col h-full">
        {currentlyEditing === "hero" && <HeroSidebar />}
        {currentlyEditing === "projects" && <ProjectSidebar />}
        {currentlyEditing === "experience" && <ExperienceSidebar />}
        {currentlyEditing === "technologies" && <TechnologiesSidebar />}
        {currentlyEditing === "contact" && <ContactSidebar />}

        {currentlyEditing === "education" && <EducationSidebar />}
        {currentlyEditing === "terminal" && <TerminalSidebar />}
        {currentlyEditing === "simple-white-hero" && <SimpleWhiteHeroSidebar />}
      </div>
    </div>
  );
};

export default Sidebar;
