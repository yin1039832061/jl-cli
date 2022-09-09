import React, { useEffect, useState } from 'react';
import { Table as AntTable } from 'antd';
import type { PaginationProps } from 'antd';

interface Params {
  [key: string]: any;
  pageNo: number;
  pageSize: number;
}
interface IProps {
  columns: Record<string, unknown>[];
  searchParams?: any;
  pagination?: PaginationProps | boolean;
  getData: (
    params: Params,
    {
      setData,
      setTotal,
    }: { setData: (data: readonly object[]) => void; setTotal: (total: number) => void },
  ) => void;
  reset?: number;
}
const Table = (props: IProps) => {
  const { columns, searchParams = {}, getData, reset = 0, pagination = true } = props;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(
    typeof pagination !== 'boolean' &&
      Array.isArray(pagination?.pageSizeOptions) &&
      pagination.pageSizeOptions[0]
      ? (pagination.pageSizeOptions[0] as number)
      : 10,
  );
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<readonly object[]>([]);
  const [params, setParams] = useState(searchParams);
  useEffect(() => {
    setParams(searchParams);
  }, [searchParams]);
  const onChangeHandle = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
    return getData({ ...params, pageNo: page, pageSize }, { setTotal, setData });
  };
  useEffect(() => {
    if (reset) {
      setPage(1);
      setPageSize(10);
      setParams({});
    }
  }, [reset]);
  useEffect(() => {
    setPage(1);
    setPageSize(pageSize);
    getData({ ...params, pageNo: 1, pageSize }, { setTotal, setData });
  }, [params, getData]);
  return (
    <AntTable
      bordered
      columns={columns}
      dataSource={data || []}
      pagination={
        pagination
          ? {
              total: total || 0,
              showTotal: (total, range) => `${range[0]}-${range[1]} 总共 ${total} 条`,
              pageSize: pageSize,
              current: page,
              showSizeChanger: true,
              pageSizeOptions: [10, 20, 50],
              onChange: onChangeHandle,
              ...(typeof pagination !== 'boolean' ? pagination : {}),
            }
          : false
      }
    />
  );
};
export default React.memo(Table);
// function useTable=()=>{

// }
