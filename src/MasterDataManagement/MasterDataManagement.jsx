import { masterItems } from "../Data/Data";
import ViewMode from "../componentss/AdditionalComponent/ViewMode";
import CatagoryCard from "../componentss/CustomComponents/CatagoryCard";
import ImageGridCard from "../componentss/AdditionalComponent/ItemGridCard";
import MasterScreen from "../componentss/CustomComponents/MasterScreen";
import { useAppState } from "@/states/hooks/useAppState";
const MasterItemsGrid = () => {
  const {
    searchTerm,    setSearchTerm,    selectedCategory,    setSelectedCategory,    viewMode,    setViewMode,
    currentScreen,    setCurrentScreen,    selectedMaster,    setSelectedMaster  } = useAppState();

  const categories = [
    { id: "all", name: "All Items", count: masterItems.length },
    {
      id: "organization",
      name: "Organization",
      count: masterItems.filter((item) => item.category === "organization")
        .length,
    },
    {
      id: "finance",
      name: "Finance",
      count: masterItems.filter((item) => item.category === "finance").length,
    },
    {
      id: "inventory",
      name: "Inventory",
      count: masterItems.filter((item) => item.category === "inventory").length,
    },
    {
      id: "administration",
      name: "Administration",
      count: masterItems.filter((item) => item.category === "administration")
        .length,
    },
    {
      id: "approvals",
      name: "Approvals",
      count: masterItems.filter((item) => item.category === "approvals").length,
    },
    {
      id: "compliance",
      name: "Compliance",
      count: masterItems.filter((item) => item.category === "compliance")
        .length,
    },
    {
      id: "customer",
      name: "Customer",
      count: masterItems.filter((item) => item.category === "customer").length,
    },
    {
      id: "logistics",
      name: "Logistics",
      count: masterItems.filter((item) => item.category === "logistics").length,
    },
  ];
  const filteredItems = masterItems.filter((item) => {
    const matchesSearch = item.name
      ?.toLowerCase()
      .includes(searchTerm?.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleItemClick = (item) => {
    setSelectedMaster(item.id);
    setCurrentScreen("master");

    // setActiveItem(item.id)
    
  };

  const handleBackToMain = () => {
    setCurrentScreen("main");
    setSelectedMaster(null);
  };



  const MainGrid = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
           <div className="mx-auto px-2 py-3">
        {/* Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <CatagoryCard
                key={category.id}
                category={category}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            ))}
            <ViewMode setViewMode={setViewMode} viewMode={viewMode} />
          </div>
        </div>

        {/* Items Grid */}
        <ImageGridCard
          filteredItems={filteredItems}
          viewMode={viewMode}
          handleItemClick={handleItemClick}
        />
      </div>
    </div>
  );
  if (currentScreen === "master"&&selectedMaster ) {
        return <MasterScreen  />;

  }

  return <MainGrid />;
};

export default MasterItemsGrid;
