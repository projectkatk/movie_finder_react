// components are not separately saved in different files. due to the size of the application

// movie component
const Movie = (props) => {
    const { Title, Year, imdbID, Type, Poster } = props.movie;
    console.log(props.movie)

    return (
        <div className="row p-2 ">
            <div className="col-4 col-md-3 mb-3">
                <a href={`https://www.imdb.com/title/${imdbID}`} target="_blank">
                    <img src={Poster !== "N/A" ? Poster : "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" } className="img-fluid rounded" />
                </a>
            </div>
            <div className="col-8 col-md-9 mb-3 description">
                <a href={`https://www.imdb.com/title/${imdbID}`} target="_blank">
                    <h4 className="text-white fw-bold">{Title}</h4>
                    <p className="text-white">{Type} | {Year}</p>
                </a>
            </div>
        </div>
    )
}
//function to check if response is successful
const checkStatus = (response) => {
    if(response.ok) {
        return response;
    }

    throw new Error('Request was either a 404 or 500');
}
//convert response ingto json format
const json = response => response.json();


// parent component => MovieFinder
class MovidFinder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            results: [],
            error: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({
            searchTerm: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        let { searchTerm } = this.state;
        searchTerm = searchTerm.trim();
        if(!searchTerm) {
            return;
        }

        fetch(`https://www.omdbapi.com/?s=${searchTerm}&apikey=15c9aeb0`)
            .then(checkStatus)
            .then(json)
            .then(data => {
                if(data.Response === 'False') throw new Error(data.Error);

                if(data.Response === 'True' && data.Search) {
                    this.setState({results: data.Search, error: ''});
                }
            })
            .catch(err => {
                this.setState({
                    error:err.message
                });
                console.log(err);
            })            
    }
    render() {
        const { searchTerm, results , error } = this.state;

        return (
            <div className="container">
                <h1 className="text-center fw-bold text-white">Movie Finder</h1>
                <div className="row">
                    <div className="col-12 px-0">
                        <form onSubmit={this.handleSubmit} className="form-inline my-4 w-100">
                            <input type="text" className="form-control mr-sm-2 mb-2 mx-auto" placeholder="frozen" value={searchTerm} onChange={this.handleChange} />
                            <button type="submit" className="btn btn-primary d-block mx-auto">Find</button>
                        </form>
                        {/* if no error, display the movies */}
                        {(() => {
                            if (error) {
                                return error;
                            }
                            return results.map((movie, index) => {
                                // from the list of the movies, if the index is odd number, background will differ
                                return index % 2 !== 0 ? 
                                (<div className="p-2 pt-4 odd"><Movie key={movie.imdbID} movie={movie} /></div>) :
                                (<div className="p-2 pt-4" ><Movie key={movie.imdbID} movie={movie} /></div>)
                            })
                        }) ()}
                    </div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <MovidFinder />,
    document.getElementById('root')
)