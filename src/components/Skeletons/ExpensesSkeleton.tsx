import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const centerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
};

const box = (max: number) => ({
  width: '100%',
  maxWidth: max,
});

const inner = {
  width: '100%',
  maxWidth: '900px',   // controls how centered content looks
  margin: '0 auto',
};

const ExpensesSkeleton = () => {
  return (
    <div style={{ borderRadius: '5px', overflow: 'hidden', width: '100%' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout:'fixed' }}>

        {/* HEADER */}
        <thead>
          <tr style={{ background: '#d1eaff' }}>
            <th style={{ padding: 14 }}>
              <div style={inner}>
                <div style={centerStyle}>
                  <div style={box(80)}><Skeleton height={18}/></div>
                </div>
              </div>
            </th>

            <th style={{ padding: 14 }}>
              <div style={inner}>
                <div style={centerStyle}>
                  <div style={box(120)}><Skeleton height={18}/></div>
                </div>
              </div>
            </th>

            <th style={{ padding: 14 }}>
              <div style={inner}>
                <div style={centerStyle}>
                  <div style={box(120)}><Skeleton height={18}/></div>
                </div>
              </div>
            </th>

            <th style={{ padding: 14 }}>
              <div style={inner}>
                <div style={centerStyle}>
                  <div style={box(80)}><Skeleton height={18}/></div>
                </div>
              </div>
            </th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {[1,2,3,4,5,6,7,8].map((i) => (
            <tr key={i}>
              
              <td style={{ padding: 12 }}>
                <div style={inner}>
                  <div style={centerStyle}>
                    <div style={box(100)}><Skeleton /></div>
                  </div>
                </div>
              </td>

              <td style={{ padding: 12 }}>
                <div style={inner}>
                  <div style={centerStyle}>
                    <div style={box(140)}><Skeleton /></div>
                  </div>
                </div>
              </td>

              <td style={{ padding: 12 }}>
                <div style={inner}>
                  <div style={centerStyle}>
                    <div style={box(90)}><Skeleton /></div>
                  </div>
                </div>
              </td>

              <td style={{ padding: 12 }}>
                <div style={inner}>
                  <div style={{...centerStyle, gap:10, flexWrap: 'wrap'}}>
                    <Skeleton height={35} width={35} borderRadius={8}/>
                    <Skeleton height={35} width={35} borderRadius={8}/>
                  </div>
                </div>
              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
};

export default ExpensesSkeleton;
