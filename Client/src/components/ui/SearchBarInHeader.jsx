import { Search } from "lucide-react";
import { useContext, useState } from "react";
import SearchModal from "./SearchModal";
import Context from "../../store/Context";

const SearchBarInHeader = () => {
  const [inputValue, setInputValue] = useState("");
  const { 
    setSearchTerm, 
    setIsSearchModalOpen 
  } = useContext(Context);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setSearchTerm(value);
    
    if (value.trim()) {
      setIsSearchModalOpen(true);
    } else {
      setIsSearchModalOpen(false);
    }
  };

  return (
    <>
      <form className="d-none d-md-flex">
        <div className="input-group position-relative">
          <span className="input-group-text bg-light border-0">
            <Search size={18} />
          </span>
          <input
            type="text"
            className="form-control border-0 bg-light"
            placeholder="Search Social Sphere"
            value={inputValue}
            onChange={handleChange}
            onFocus={() => inputValue.trim() && setIsSearchModalOpen(true)}
          />
        </div>
      </form>
      
      <SearchModal />
    </>
  );
};

export default SearchBarInHeader;