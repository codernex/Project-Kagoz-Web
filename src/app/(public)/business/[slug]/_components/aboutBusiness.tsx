export const AboutBusiness = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div className="space-y-sm">
        <h2 className="text-mdx font-bold text-black">About Our Business</h2>
        <div className="text-sm leading-smlg text-muted">
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi
            aliquam quasi dolorem. Quisquam, repudiandae ab eligendi eum eaque
            aliquam esse libero omnis culpa eius in magnam, dolores alias illo
            nulla.
          </p>
        </div>
      </div>

      <div className="space-y-sm">
        <h2 className="text-mdx font-bold text-black">Our Service List</h2>
        <div className="space-y-smd">
          {Array.from({
            length: 4,
          }).map((_, index) => {
            return (
              <div key={index} className="flex items-center space-x-xsm">
                <div className="h-[4rem] w-[4rem] border border-borderColor rounded-full"></div>
                <div>
                  <h3 className="font-bold text-black text-smd">Automotive</h3>
                  <p className="text-muted">
                    Pellentesque blandit risus vel mauris
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
