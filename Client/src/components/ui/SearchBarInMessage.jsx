import { useContext, useState } from "react";
import Context from "../../store/Context";

const SearchBarInMessage = () => {
  const [inputValue, setInputValue] = useState("");
  const { setSearchTerm } = useContext(Context); 

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setSearchTerm(value); 
  };

  return (
    <form className="d-none d-md-flex">
      <div className="input-group position-relative">
        <input
          type="text"
          className="form-control border-0 bg-light"
          placeholder="Search Social Sphere"
          value={inputValue}
          onChange={handleChange}
        />
      </div>
    </form>
  );
};

export default SearchBarInMessage;