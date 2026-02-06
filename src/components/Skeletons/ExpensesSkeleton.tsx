import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const centerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const ExpensesSkeleton = () => {
  return (
    <div style={{ borderRadius: '5px', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>

        <thead>
          <tr style={{ background: '#d1eaff' }}>
            <th style={{ padding: 14 }}>
              <div style={centerStyle}><Skeleton width={80} /></div>
            </th>
            <th style={{ padding: 14 }}>
              <div style={centerStyle}><Skeleton width={120} /></div>
            </th>
            <th style={{ padding: 14 }}>
              <div style={centerStyle}><Skeleton width={120} /></div>
            </th>
            <th style={{ padding: 14 }}>
              <div style={centerStyle}><Skeleton width={80} /></div>
            </th>
          </tr>
        </thead>

        <tbody>
          {[1,2,3,4,5,6,7,8].map((i) => (
            <tr key={i}>
              
              {/* date */}
              <td style={{ padding: 5 }}>
                <div style={centerStyle}>
                  <Skeleton width={100} />
                </div>
              </td>

              {/* title */}
              <td style={{ padding: 5 }}>
                <div style={centerStyle}>
                  <Skeleton width={140} />
                </div>
              </td>

              {/* amount */}
              <td style={{ padding: 5 }}>
                <div style={centerStyle}>
                  <Skeleton width={90} />
                </div>
              </td>

              {/* actions */}
              <td style={{ padding: 5 }}>
                <div style={{...centerStyle, gap: 10}}>
                  <Skeleton height={35} width={35} borderRadius={8} />
                  <Skeleton height={35} width={35} borderRadius={8} />
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
