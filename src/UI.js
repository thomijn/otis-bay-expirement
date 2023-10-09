export default function Ui() {
  return (
    <>
      <div className="container">
        <div className="wrapper">
          <div className='livefeed'>
            <div className='livefeed__title'>Working on</div>
          </div>

          <div className='header'>
            <img src='logo.svg' />
            <nav>
              <ul>
                <li><a href='#'>Work</a></li>
                <li><a href='#'>Otis Who?</a></li>
                <li><a href='#'>No code</a></li>
                <li><a href='#'>Contact</a></li>
              </ul>
            </nav>
          </div>
        </div>

        <div class="page-background">
          <div class="page-background_content">
            <div class="page-background_line"></div>
            <div class="page-background_line"></div>
            <div class="page-background_line"></div>
            <div class="page-background_line"></div>
          </div>
        </div>

      </div>
      <div class="grain-overlay w-embed">
        <div class="grain"></div>
      </div>
    </>
  );
}
