const Suggest = ({ data }) => {
  const truncateTitle = (title, maxLength = 60) => {
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + "...";
    }
    return title;
  };

  return (
    <div>
      <a
        href={data["smart_link"]}
        className="flex flex-col justify-center items-center"
      >
        <div className="bg-black rounded-lg shadow-md backdrop-blur-sm border border-white border-opacity-30 overflow-y-auto flex flex-col items-baseline m-0  opacity-90 cursor-pointer mt-6">
          <div className="w-full aspect-video overflow-hidden">
            <img
              className="h-full w-full object-cover "
              src={data.metadata.image}
              srcSet={`${data.metadata.image}?w=300 300w, ${data.metadata.image}?w=600 600w, ${data.metadata.image}?w=900 900w`}
              sizes="(max-width: 600px) 300px, (max-width: 900px) 600px, 800px"
              alt={data.metadata.title}
              loading="lazy"
            />
          </div>
          <div className="w-full">
            <div className="h-16 flex justify-start items-center text-white p-3 font-bold break-word no-underline">
              {truncateTitle(data.metadata.title)}
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

export default Suggest;
