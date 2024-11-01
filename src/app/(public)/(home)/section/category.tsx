import CategoryItem from "./components/category-item";

const Category = () => {
  return (
    <section className="bg-[#6F00FF05] section_padding">
      <div className="container">
        <h2 className="section_title pb-[6rem] ">Our Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-[2rem] gap-y-[2rem] lg:gap-x-[3.2rem] lg:gap-y-[3.5rem]">
          {Array.from({ length: 12 }).map((_, index) => {
            return <CategoryItem key={index} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default Category;
