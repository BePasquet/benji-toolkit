import { Paper } from '@mui/material';

export function Payment() {
  return (
    <div>
      <Paper elevation={2}>
        {/* eslint-disable-next-line */}
        <a
          href="https://www.buymeacoffee.com/addictivebjj"
          target="_blank"
          style={{
            padding: '8px',
            backgroundColor: '#000',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '4px',
          }}
        >
          Donate
        </a>
      </Paper>

      <script
        type="text/javascript"
        src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js"
        data-name="bmc-button"
        data-slug="addictivebjj"
        data-color="#40DCA5"
        data-emoji=""
        data-font="Cookie"
        data-text="Buy me a coffee"
        data-outline-color="#000000"
        data-font-color="#ffffff"
        data-coffee-color="#FFDD00"
      ></script>
    </div>
  );
}
