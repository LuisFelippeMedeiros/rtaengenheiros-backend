import { Controller, Get, Query } from '@nestjs/common';
import { RouteVersion } from 'src/statics/route.version';
import { RowCountService } from './rowcount.service';

@Controller({
  path: RouteVersion.route + 'rowCount',
  version: RouteVersion.version,
})
export class RowCountController {
  constructor(private readonly rowCountService: RowCountService) {}

  @Get()
  async countRows(
    @Query('filter') filterQuery: string,
    @Query('module') moduleQuery: string,
    @Query('active') activeQuery: boolean,
  ) {
    const paginator: IPaginator = {
      active: activeQuery,
      filter: filterQuery.toUpperCase(),
      module: moduleQuery,
      page: 0,
    };

    return await this.rowCountService.rowCount(paginator);
  }

  @Get('bill_status')
  async billStatus() {
    return await this.rowCountService.countBills();
  }
}
